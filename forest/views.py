from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotFound
import ujson

from .models import Node, Relation


def xhr_node_by_slug(request, slug):
    nqs = Node.objects.filter(slug=slug)
    if nqs is None or len(nqs) == 0:
        return HttpResponseNotFound('<h1>No such node</h1>')

    node = nqs[0]

    return JsonResponse(
        {
            'name': node.name,
            'slug': node.slug,
            'text': node.text
        }, safe=False)


def xhr_relations_for_parent_node(request, slug):
    return JsonResponse(
        [{
            'text': r.text,
            'parent': r.parent.slug,
            'child': r.child.slug,
            'slug': r.slug,
            'author': r.author.username
        } for r in Relation.objects.filter(parent__slug=slug)],
        safe=False)


def node(request):
    return render(request, 'node.html')
