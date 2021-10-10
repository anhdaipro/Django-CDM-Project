# Generated by Django 3.2.4 on 2021-10-02 04:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0010_auto_20211001_2029'),
    ]

    operations = [
        migrations.AddField(
            model_name='shipping',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='shipping',
            name='shop',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shops.shop'),
        ),
    ]
