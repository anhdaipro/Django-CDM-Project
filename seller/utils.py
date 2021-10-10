
from django.db.models import Count, Sum
from order.models import *
from payment.models import Payment
def get_total_per_month_value():
    """
    Return the total of sales per month

    ReturnType: [Dict]
    {'December': 3400, 'February': 224, 'January': 792}
    """
    result= {}
    db_result = Payment.objects.values('amount','timestamp')
    for i in db_result:
        month = str(i.get('timestamp').strftime("%H"))
        if month in result.keys():
            result[month] = result[month] + i.get('amount')
        else:
            result[month] = i.get('amount')
    return result