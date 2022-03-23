package com.example.demo.resource;

import com.example.demo.enumeration.Status;
import com.example.demo.model.Response;
import com.example.demo.model.Server;
import com.example.demo.service.implementation.ServerServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static java.util.Map.of;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/server")
@RequiredArgsConstructor
public class ServerResource {

    private final ServerServiceImplementation serviceImplementation;


    @GetMapping("/list")
    public ResponseEntity<Response> getServers(){
        return ResponseEntity.ok(Response.builder().
                timeStamp(now()).data(of("servers", serviceImplementation.list(10))).
                message("Servers retrieved").
                status(HttpStatus.OK).
                statusCode(HttpStatus.OK.value()).
                build());
    }


    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServer(@PathVariable("ipAddress") String ipAddress) throws IOException {
        Server server = serviceImplementation.ping(ipAddress);
        return ResponseEntity.ok(Response.builder().
                timeStamp(now()).data(of("server", serviceImplementation.list(30))).
                message(server.getStatus() == Status.SERVER_UP ? "Ping success" : "Ping failed").
                status(HttpStatus.OK).
                statusCode(HttpStatus.OK.value()).
                build());
    }

    @PostMapping("/save")
    public ResponseEntity<Response> saveServer(@RequestBody @Valid Server server){
        return ResponseEntity.ok(Response.builder().
                timeStamp(now()).data(of("server", serviceImplementation.create(server))).
                message("Server created").
                status(HttpStatus.CREATED).
                statusCode(HttpStatus.CREATED.value()).
                build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Response> getServer(@PathVariable("id") Long id){
        return ResponseEntity.ok(Response.builder().
                timeStamp(now()).data(of("server", serviceImplementation.get(id))).
                message("Server retrieved").
                status(HttpStatus.OK).
                statusCode(HttpStatus.OK.value()).
                build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteServer(@PathVariable("id") Long id){
        return ResponseEntity.ok(Response.builder().
                timeStamp(now()).data(of("server", serviceImplementation.delete(id))).
                message("Server deleted").
                status(HttpStatus.OK).
                statusCode(HttpStatus.OK.value()).
                build());
    }


    @GetMapping(path = "/image/{fileName}", produces = IMAGE_PNG_VALUE)
    public byte[] getServerImage(@PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "/Downloads/images/" + fileName));
    }

}
