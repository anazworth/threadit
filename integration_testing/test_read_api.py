import requests

ENDPOINT = "http://localhost:8000/api/v1"

def test_can_create_post():
    payload = {
        "user": "curry",
        "topic": "Shiba",
        "title": "where is chez",
        "content": "My name is corny and I'm on the hunt for one whole cheese"
    }
    jar = dict(jwtCookie="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXJyeSIsImlhdCI6MTY4NTgzMDgzMiwiZXhwIjoxNjg1OTE3MjMyfQ.qSQgoZAdO8WzYEa2L9ewJ_J4NDU-uZmm-W4fm628Y_Y")
    response = requests.post(ENDPOINT + "/write/post", json=payload, cookies=jar)
    assert response.status_code == 200
    print(response.text)
    
    post_id = response.json()['post_id']
    print(post_id)

    read_post_response = requests.get(f"http://localhost:8081/api/v1/read/{post_id}")
    assert read_post_response.status_code == 200

    post = read_post_response.json()
    assert payload["user"] == post["user"]
    assert payload["topic"] == post["topic"]
    assert payload["title"] == post["title"]
    assert payload["content"] == post["content"]

