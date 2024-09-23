// // src/useWebSocket.js
// import React,{ useState, useEffect, useCallback } from 'react';

// const useWebSocket = (url) => {
//     const [socket, setSocket] = useState(null);
//     const [message, setMessage] = useState(null);

//     useEffect(() => {
//         const ws = new WebSocket(url);

//         ws.onopen = () => {
//             console.log('WebSocket connected');
//         };

//         ws.onmessage = (event) => {
//             console.log("WebSocket :: 1", event.data)
//             setMessage(event.data);
//         };

//         ws.onclose = () => {
//             console.log('WebSocket disconnected');
//         };

//         setSocket(ws);

//         return () => {
//             ws.close();
//         };
//     }, [url]);

//     const sendMessage = useCallback((msg) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             socket.send(msg);
//         }
//     }, [socket]);

//     return { message, sendMessage };
// };

// export default useWebSocket;
