"""실행 중인 API(기본 127.0.0.1:3052)를 대상으로 등록·수정·업로드·삭제 흐름을 확인한다.

실행: python tests/test_api_smoke.py
임시 에이전트를 만들고 마지막에 삭제하므로 기존 데이터는 바뀌지 않는다.
"""

import io
import json
import os
import unittest
import urllib.error
import urllib.request

from PIL import Image

API = os.getenv("PORTFOLIO_TEST_API", "http://127.0.0.1:3052")


def call(method, path, body=None, headers=None):
    data = body if isinstance(body, (bytes, type(None))) else json.dumps(body).encode()
    request = urllib.request.Request(API + path, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(request) as response:
            raw = response.read()
            return response.status, (json.loads(raw) if raw[:1] in b"{[" else raw)
    except urllib.error.HTTPError as error:
        return error.code, json.loads(error.read() or b"{}")


def image_bytes(fmt):
    buffer = io.BytesIO()
    Image.new("RGB", (800, 1200), (30, 90, 160)).save(buffer, fmt)
    return buffer.getvalue()


class ApiSmokeTest(unittest.TestCase):
    def setUp(self):
        status, agent = call("POST", "/agents", {"name": "테스트 에이전트"})
        self.assertEqual(status, 201)
        self.agent_id = agent["id"]
        self.addCleanup(call, "DELETE", f"/agents/{self.agent_id}")

    def test_validation(self):
        self.assertEqual(call("POST", "/agents", {"name": "  "})[0], 400)
        self.assertEqual(call("PATCH", f"/agents/{self.agent_id}", {"age": "abc"})[0], 400)
        self.assertEqual(call("GET", "/agents/999999")[0], 404)

    def test_update(self):
        status, agent = call("PATCH", f"/agents/{self.agent_id}", {"age": "23", "nationality": "한국", "shoe_size": ""})
        self.assertEqual(status, 200)
        self.assertEqual((agent["age"], agent["nationality"], agent["shoe_size"]), (23, "한국", None))

    def test_photo_upload_and_delete(self):
        path = f"/agents/{self.agent_id}/photos"
        status, agent = call("POST", path, image_bytes("JPEG"), {"Content-Type": "image/jpeg", "X-Filename": "a.jpg"})
        self.assertEqual(status, 201)
        photo = agent["photos"][0]
        self.assertEqual(call("GET", "/media/" + photo["object_path"])[0], 200)
        self.assertEqual(call("GET", "/media/" + photo["thumb_path"])[0], 200)
        self.assertEqual(call("POST", path, b"not an image", {"X-Filename": "x.jpg"})[0], 400)
        status, agent = call("DELETE", f"/photos/{photo['id']}")
        self.assertEqual((status, agent["photos"]), (200, []))
        self.assertEqual(call("GET", "/media/" + photo["object_path"])[0], 404)

    def test_turnaround_accepts_only_gif(self):
        path = f"/agents/{self.agent_id}/turnaround"
        self.assertEqual(call("PUT", path, image_bytes("PNG"), {"X-Filename": "a.png"})[0], 400)
        status, agent = call("PUT", path, image_bytes("GIF"), {"X-Filename": "a.gif"})
        self.assertEqual(status, 200)
        first = agent["turnaround_path"]
        status, agent = call("PUT", path, image_bytes("GIF"), {"X-Filename": "b.gif"})
        self.assertNotEqual(agent["turnaround_path"], first)
        self.assertEqual(call("GET", "/media/" + first)[0], 404)

    def test_media_path_traversal_rejected(self):
        self.assertEqual(call("GET", "/media/../../scripts/local_api.py")[0], 404)
        self.assertEqual(call("GET", "/media/..%2F..%2Fscripts%2Flocal_api.py")[0], 404)


if __name__ == "__main__":
    unittest.main()
