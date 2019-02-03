from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound

from .models import Node, Relation


def node(request, node=None):

    if node is None:
        node = 'forever'

    nqs = Node.objects.filter(slug=node)
    if nqs is None or len(nqs) == 0:
        return HttpResponseNotFound('<h1>No such node</h1>')

    node = nqs[0]

    relations = Relation.objects.filter(parent=node)

    ctx = {
        'node': node,
        'relations': relations
    }

    return render(request, 'node.html', ctx)
