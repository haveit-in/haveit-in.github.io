from app.auth import (
    issue_token_pair,
    verify_access_token,
    verify_refresh_token,
)


def test_issue_and_verify_pair():
    tokens = issue_token_pair("user-uuid", ["user"])
    assert "access_token" in tokens and "refresh_token" in tokens

    access = verify_access_token(tokens["access_token"])
    assert access is not None
    assert access.get("user_id") == "user-uuid"
    assert access.get("roles") == ["user"]

    refresh = verify_refresh_token(tokens["refresh_token"])
    assert refresh is not None
    assert refresh.get("typ") == "refresh"


def test_access_verifier_rejects_refresh_token():
    tokens = issue_token_pair("u1", ["admin"])
    assert verify_access_token(tokens["refresh_token"]) is None
