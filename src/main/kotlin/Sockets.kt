package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
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
            println("Add User")
            val thisConnection = Connection(this)
            connections += thisConnection
            try {
                for (frame in incoming) {
                    when (frame) {
                        is Frame.Text -> {
                            val receivedText = frame.readText()
                            val textWithUserName = "[${thisConnection.name}] $receivedText"
                            connections.forEach {
                                it.session.send(textWithUserName)
                            }
                        } else -> {}
                    }
                }
            } catch (e: Exception) {
                println(e.localizedMessage)
            }finally {
                println("Remove $thisConnection!")
                connections -= thisConnection
            }
        }
    }
}
