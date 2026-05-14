from app.auth import issue_token_pair, verify_access_token
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_root_ok():
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert "message" in body


def test_refresh_rejects_invalid_token():
    response = client.post("/auth/refresh", json={"refresh_token": "not-a-jwt"})
    assert response.status_code == 401


def test_refresh_returns_new_pair():
    tokens = issue_token_pair("u1", ["user"])
    response = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body and "refresh_token" in body
    assert verify_access_token(body["access_token"]) is not None
    assert verify_access_token(body["refresh_token"]) is None
