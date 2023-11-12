import nmap
from scapy.all import traceroute
import networkx as nx
from networkx.readwrite import gexf
import random

def scan_network(ip_range):
    nm = nmap.PortScanner()
    nm.scan(hosts=ip_range, arguments='-sn')

    live_hosts = [host for host in nm.all_hosts() if nm[host]['status']['state'] == 'up']
    return live_hosts

def trace_route(target_host):
    result, unans = traceroute(target_host, maxttl=30, verbose=0)
    routes = []
    for snd, rcv in result:
        if rcv.src not in routes:
            routes.append(rcv.src)
    return routes

def create_network_topology(ip_range):
    live_hosts = scan_network(ip_range)
    G = nx.Graph()

    for host_id, host in enumerate(live_hosts):
        # Assign a brighter color and larger size to each node
        color = "#{:02x}{:02x}{:02x}".format(random.randint(200, 255), random.randint(0, 50), random.randint(0, 50))
        size = random.uniform(10, 20)  # Adjust the range for node size
        x = random.uniform(-100, 100)  # Set a random x coordinate
        y = random.uniform(-100, 100)  # Set a random y coordinate
        G.add_node(host_id, label=host, color=color, size=size, x=x, y=y)

    for host_id, host in enumerate(live_hosts):
        routes = trace_route(host)
        for i in range(len(routes) - 1):
            # Assign a brighter color to each edge
            color = "#{:02x}{:02x}{:02x}".format(random.randint(0, 50), random.randint(0, 50), random.randint(200, 255))
            G.add_edge(live_hosts.index(routes[i]), live_hosts.index(routes[i + 1]), color=color)

    return G

def export_to_gexf(graph, output_file):
    nx.write_gexf(graph, output_file)

if __name__ == "__main__":
    ip_range = "192.168.0.0/24"
    output_file = "network_topology.gexf"

    network_topology = create_network_topology(ip_range)
    export_to_gexf(network_topology, output_file)
    print(f"Network topology exported to {output_file}")
