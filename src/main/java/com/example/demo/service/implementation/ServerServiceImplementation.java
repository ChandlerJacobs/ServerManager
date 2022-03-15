package com.example.demo.service.implementation;

import com.example.demo.enumeration.Status;
import com.example.demo.model.Server;
import com.example.demo.repo.ServerRepo;
import com.example.demo.service.ServerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Collection;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerServiceImplementation implements ServerService {

    private final ServerRepo serverRepo;


    @Override
    public Server create(Server server) {
        log.info("saving new server: {}", server.getName());
        server.setImageUrl(setServerImageUrl());
        return serverRepo.save(server);
    }

    private String setServerImageUrl() {
        return null;
    }

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server IP: {}", ipAddress);
        Server server = serverRepo.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        serverRepo.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fetching all servers");
        return serverRepo.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(long id) {
        log.info("Fetching server by ID: {}", id);
        return serverRepo.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        return null;
    }

    @Override
    public Boolean delete(long id) {
        return null;
    }
}
