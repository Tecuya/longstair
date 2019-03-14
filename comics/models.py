from django.db import models


class Comic(models.Model):
    name = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    created = models.DateTimeField('created')

    active = models.BooleanField(default=True)

    def __str__(self):
        return '{} {} {}'.format(self.name, self.filename, self.created)
