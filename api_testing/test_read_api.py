import requests
import pytest

ENDPOINT = "http://localhost:8888/api/v1"

def test_can_create_user():
    payload = {
            "username": "CurryNazworth",
            "password": "1234"
            }

    response = requests.post(ENDPOINT + "/users", params=payload)

    assert response.status_code == 201
    
def test_can_login_user():
    payload = {
        "username": "CurryNazworth",
        "password": "1234"
    }
    
    response = requests.post(ENDPOINT + "/users/login", json=payload)
    
    assert response.status_code == 200
    assert response.json()["username"] == "CurryNazworth"
    assert response.json()["jwt"] is not None
    assert response.cookies is not None
    
    JWT = response.json()["jwt"]

@pytest.fixture
def get_jwt_from_login():
    payload = {
        "username": "CurryNazworth",
        "password": "1234"
    }
    
    response = requests.post(ENDPOINT + "/users/login", json=payload)
    JWT = response.json()["jwt"]
    return JWT


def test_can_create_post(get_jwt_from_login):
    JWT = get_jwt_from_login
    payload = {
        "user": "CurryNazworth",
        "topic": "Shiba",
        "title": "where is chez",
        "content": "My name is corny and I'm on the hunt for one whole cheese"
    }
    jar = dict(jwtCookie=JWT)
    response = requests.post(ENDPOINT + "/write/post", json=payload, cookies=jar)
    assert response.status_code == 201
    assert response.json()["user"] == "CurryNazworth"
    assert response.json()["topic"] == "Shiba"
    assert response.json()["title"] == "where is chez"
    assert response.json()["content"] == "My name is corny and I'm on the hunt for one whole cheese"
    assert response.json()["post_id"] is not None
    assert response.json()["created"] is not None
    