#! /bin/sh

docker run --name trader-perf -e POSTGRES_PASSWORD=password -d -p5432:5432 postgres

