document.addEventListener("DOMContentLoaded", function(event) { 
    const ws = new WebSocket("ws://localhost:9000");
    let peerConnection = null;

    ws.onopen = ( ) => {
        ws.send(JSON.stringify({"action": "start_webrtc", "params" : {}}))
        peerConnection = new RTCPeerConnection();
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({"action": "send_ice", "params" : {"id": "", "ice": event.candidate}}));
              } else {
              }
        };

        peerConnection.ontrack = (event) => {
            document.getElementById("video").srcObject = event.streams[0];
        };
    };


    ws.onmessage = ( message ) => {
        const data = JSON.parse(message.data);
        if (data.action == "ice"){
            peerConnection.addIceCandidate(new RTCIceCandidate(data.params.ice));
        }else if (data.action == "sdp"){
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.params.sdp));
                peerConnection.createAnswer().then( (answer) => {
                    peerConnection.setLocalDescription(answer);
                    ws.send(JSON.stringify({'action': 'send_sdp', 'params' : {'sdp' : answer, 'id': data.params.id}}));
            });

        }
    };

    

  });