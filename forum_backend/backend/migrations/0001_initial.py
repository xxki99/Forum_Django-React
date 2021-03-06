# Generated by Django 3.1.5 on 2021-02-05 13:59

import backend.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('pub_date', models.DateTimeField(default=backend.models.getUTCDate)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.userprofile')),
                ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.thread')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=255)),
                ('pub_date', models.DateTimeField(default=backend.models.getUTCDate)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.userprofile')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.post')),
            ],
        ),
    ]
