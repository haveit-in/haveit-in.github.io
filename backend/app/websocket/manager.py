import asyncio
import json
import logging
from typing import Dict, List

from fastapi import WebSocket, WebSocketDisconnect

log = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections by order_id
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Store user connections for authentication
        self.user_connections: Dict[WebSocket, str] = {}  # websocket -> user_id

    async def connect(self, websocket: WebSocket, order_id: str, user_id: str):
        """Register an already-accepted WebSocket for a specific order."""
        if order_id not in self.active_connections:
            self.active_connections[order_id] = []
        self.active_connections[order_id].append(websocket)

        self.user_connections[websocket] = user_id

        log.debug("websocket_registered order_id=%s user_id=%s", order_id, user_id)

    def disconnect(self, websocket: WebSocket, order_id: str):
        """Disconnect a WebSocket from an order"""
        if order_id in self.active_connections:
            if websocket in self.active_connections[order_id]:
                self.active_connections[order_id].remove(websocket)
            
            # Clean up empty order connections
            if not self.active_connections[order_id]:
                del self.active_connections[order_id]
        
        # Remove user mapping
        if websocket in self.user_connections:
            user_id = self.user_connections.pop(websocket)
            log.debug("websocket_unregistered order_id=%s user_id=%s", order_id, user_id)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket"""
        try:
            await websocket.send_text(message)
        except Exception:
            log.warning("websocket_send_failed", exc_info=True)

    async def broadcast_to_order(self, order_id: str, message: dict):
        """Broadcast a message to all connections for a specific order"""
        if order_id in self.active_connections:
            disconnected_connections = []
            
            for connection in self.active_connections[order_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    log.warning("websocket_broadcast_failed", exc_info=True)
                    disconnected_connections.append(connection)
            
            # Clean up disconnected connections
            for connection in disconnected_connections:
                self.disconnect(connection, order_id)

    async def broadcast_order_status_update(self, order_id: str, status: str, message: str, estimated_delivery_time: str = None):
        """Broadcast order status update to all connected clients"""
        update_message = {
            "type": "order_status_update",
            "order_id": order_id,
            "status": status,
            "message": message,
            "estimated_delivery_time": estimated_delivery_time,
            "timestamp": str(asyncio.get_event_loop().time())
        }
        
        await self.broadcast_to_order(order_id, update_message)

    async def broadcast_delivery_confirmation(self, order_id: str):
        """Broadcast delivery confirmation with celebration trigger"""
        delivery_message = {
            "type": "order_delivered",
            "order_id": order_id,
            "status": "DELIVERED",
            "message": "Your order has been delivered successfully!",
            "trigger_celebration": True,
            "timestamp": str(asyncio.get_event_loop().time())
        }
        
        await self.broadcast_to_order(order_id, delivery_message)

    def get_connection_count(self, order_id: str) -> int:
        """Get number of active connections for an order"""
        return len(self.active_connections.get(order_id, []))

    def is_user_connected(self, user_id: str) -> bool:
        """Check if a user has any active connections"""
        return user_id in self.user_connections.values()

# Global connection manager instance
manager = ConnectionManager()
