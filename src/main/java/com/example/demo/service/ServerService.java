package com.example.demo.service;

import com.example.demo.model.Server;
import com.example.demo.repo.ServerRepo;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Collection;

public interface ServerService {


    Server create(Server server);
    Server ping(String ipAddress) throws IOException;
    Collection<Server> list(int limit);
    Server get(long id);
    Server update(Server server);
    Boolean delete(long id);

}
