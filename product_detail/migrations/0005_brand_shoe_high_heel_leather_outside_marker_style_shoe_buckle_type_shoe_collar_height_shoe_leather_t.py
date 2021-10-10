# Generated by Django 3.2.4 on 2021-10-10 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product_detail', '0004_auto_20210929_1853'),
    ]

    operations = [
        migrations.CreateModel(
            name='Brand_shoe',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='High_heel',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Leather_outside',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Marker_Style',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Shoe_buckle_type',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Shoe_collar_height',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Shoe_leather_type',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Shoe_material',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Shoe_Occasion',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Suitable_width',
            fields=[
                ('title', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
    ]
