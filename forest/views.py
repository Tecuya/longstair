from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotFound
import ujson

from .models import Node, Relation


def xhr_node_by_slug(request, slug):
    nqs = Node.objects.filter(slug=slug)
    if nqs is None or len(nqs) == 0:
        return HttpResponseNotFound('<h1>No such node</h1>')

    node = nqs[0]

    if request.method == 'POST':
        doc = ujson.loads(request.body)
        node.name = doc['name']
        node.slug = doc['slug']
        node.text = doc['text']
        node.save()

    return JsonResponse(
        {'name': node.name,
         'slug': node.slug,
         'text': node.text,
         'author': node.author.username,
         'created': node.created.strftime('%Y-%m-%d')},
        safe=False)


def xhr_relations_for_parent_node(request, slug):
    return JsonResponse(
        [{'text': r.text,
          'slug': r.slug,

          'parent': r.parent.slug,
          'child': r.child.slug,

          'author': r.author.username,
          'created': r.created.strftime('%Y-%m-%d')}
         for r in Relation.objects.filter(parent__slug=slug)],
        safe=False)


def xhr_fetch_relations_for_text(request, slug, text):
    return JsonResponse(
        [{'text': r.text,
          'slug': r.slug,

          'parent': r.parent.slug,
          'child': r.child.slug,

          'author': r.author.username,
          'created': r.created.strftime('%Y-%m-%d')}
         for r in Relation.objects.filter(parent__slug=slug, text__contains=text)],
        safe=False)


def xhr_nodes_for_text(request, text):
    return JsonResponse(
        [{'name': n.name,
          'slug': n.slug,
          'author': n.author.username,
          'created': n.created.strftime('%Y-%m-%d')}
         for n in Node.objects.filter(name__contains=text)],
        safe=False)


def node(request):
    return render(request, 'node.html')
