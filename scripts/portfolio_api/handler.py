"""HTTP Handler 계층. URL·JSON 파싱, 상태코드, CORS, 오류 변환만 담당한다."""

import json
import logging
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

from . import config, media, repository
from .repository import NotFound, ValidationError

logger = logging.getLogger("portfolio.handler")


class Handler(BaseHTTPRequestHandler):
    server_version = "AgentPortfolioAPI/0.1"

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Filename")
        super().end_headers()

    def send_json(self, value, status=200):
        body = json.dumps(value, ensure_ascii=False, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length > config.MAX_UPLOAD_BYTES:
            raise ValidationError("파일 크기는 20MB 이하여야 합니다.")
        return self.rfile.read(length)

    def read_json(self):
        try:
            return json.loads(self.read_body() or b"{}")
        except json.JSONDecodeError:
            raise ValidationError("JSON 형식이 올바르지 않습니다.") from None

    def filename(self):
        return unquote(self.headers.get("X-Filename", ""))[:200] or None

    def dispatch(self, method):
        parts = [p for p in urlparse(self.path).path.split("/") if p]
        try:
            self.route(method, parts)
        except (ValidationError, media.MediaError) as exc:
            self.send_json({"message": str(exc)}, 400)
        except NotFound as exc:
            self.send_json({"message": str(exc)}, 404)
        except Exception:  # noqa: BLE001 - 응답으로 변환하고 기록한다
            logger.exception("request failed %s %s", method, self.path)
            self.send_json({"message": "서버 오류가 발생했습니다."}, 500)

    def route(self, method, parts):
        if method == "GET" and parts[:1] == ["media"]:
            return self.send_media("/".join(unquote(p) for p in parts[1:]))
        if method == "GET" and (not parts or parts == ["health"]):
            return self.send_json({"status": "ok"})
        if parts[:1] == ["agents"]:
            return self.route_agents(method, parts[1:])
        if parts[:1] == ["photos"] and len(parts) == 2 and parts[1].isdigit() and method == "DELETE":
            return self.send_json(repository.delete_photo(int(parts[1])))
        raise NotFound("요청한 경로가 없습니다.")

    def route_agents(self, method, rest):
        if not rest:
            if method == "GET":
                return self.send_json(repository.list_agents())
            if method == "POST":
                return self.send_json(repository.create_agent(self.read_json()), 201)
        elif rest[0].isdigit():
            agent_id = int(rest[0])
            if len(rest) == 1:
                if method == "GET":
                    return self.send_json(repository.get_agent(agent_id))
                if method == "PATCH":
                    return self.send_json(repository.update_agent(agent_id, self.read_json()))
                if method == "DELETE":
                    repository.delete_agent(agent_id)
                    return self.send_json({"deleted": agent_id})
            elif rest[1:] == ["turnaround"] and method == "PUT":
                return self.send_json(repository.set_turnaround(agent_id, self.read_body(), self.filename()))
            elif rest[1:] == ["photos"] and method == "POST":
                return self.send_json(repository.add_photo(agent_id, self.read_body(), self.filename()), 201)
        raise NotFound("요청한 경로가 없습니다.")

    def send_media(self, relative):
        target = media.resolve(relative)
        if not target:
            raise NotFound("파일을 찾을 수 없습니다.")
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mimetypes.guess_type(target.name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "public, max-age=86400")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        self.dispatch("GET")

    def do_POST(self):
        self.dispatch("POST")

    def do_PUT(self):
        self.dispatch("PUT")

    def do_PATCH(self):
        self.dispatch("PATCH")

    def do_DELETE(self):
        self.dispatch("DELETE")

    def log_message(self, fmt, *args):
        logger.info("%s %s", self.address_string(), fmt % args)


def create_server(host=None, port=None):
    return ThreadingHTTPServer((host or config.API_HOST, port or config.API_PORT), Handler)


def serve_forever(host=None, port=None):
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(message)s")
    server = create_server(host, port)
    logger.info("Agent Portfolio API listening on %s:%s", *server.server_address)
    server.serve_forever()
