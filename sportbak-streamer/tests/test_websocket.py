from fastapi.testclient import TestClient
from videoapp.main import app

class TestWebSocket:
    def test_wrong_action(self):
        client = TestClient(app)
        with client.websocket_connect("/") as websocket:
            data = websocket.receive_json()
            websocket.send_json({"action": "test", "params": {}})
            data = websocket.receive_json()

            assert data == {'action' : 'error', 'params': {'message': 'Invalid format for request'}}

    def test_status(self):
        client = TestClient(app)
        with client.websocket_connect("/") as websocket:
            websocket.send_json({"action": "status", "params": {}})
            data = websocket.receive_json()
            assert data['action'] == 'status'
            assert data['params']['error'] == True
            assert data['params']['ready'] == False