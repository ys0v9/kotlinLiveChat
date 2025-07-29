package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.awt.SystemColor.text
import java.time.Duration
import java.util.Collections
import kotlin.time.Duration.Companion.seconds

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    routing {
        val connections = Collections.synchronizedSet<Connection?>(LinkedHashSet())
        webSocket("/chat") {
            val thisConnection = Connection(this)
            connections += thisConnection

            try {
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val text = frame.readText()

                        if (thisConnection.name.isEmpty()) {
                            // first message -> name
                            thisConnection.name = text.trim()
                            // 본인한테만 네임 설정
                            outgoing.send(Frame.Text("내 닉네임: ${thisConnection.name}"))
                        } else {
                            // 네임 설정 후엔 전체한테 메시지
                            val message = "${thisConnection.name}: $text"
                            connections.forEach { conn ->
                                conn.session.send(Frame.Text(message))
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                println("Error: ${e.localizedMessage}")
            } finally {
                connections -= thisConnection
            }
        }
    }
}