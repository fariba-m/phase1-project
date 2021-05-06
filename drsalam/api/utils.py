from rest_framework.pagination import PageNumberPagination

class CategoryPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'size'


def custom_exception_handler(exc, context):
    from rest_framework.views import exception_handler
    from rest_framework.response import Response
    from pprint import pprint
    from django.http.response import Http404

    response = exception_handler(exc, context)

    if hasattr(exc, 'detail'):
        detail = exc.detail
    elif response and hasattr(response, 'data') and 'detail' in response.data:
        detail = str(response.data['detail'])
    else:
        detail = str(exc)

    if hasattr(exc, 'get_codes'):
        code = exc.get_codes()
    elif response and response.data and hasattr(response.data['detail'], 'code'):
        code = response.data['detail'].code
    else:
        code = None

    if hasattr(response, 'status_code'):
        status_code = response.status_code
    else:
        status_code = 406
    
    return Response({
        "message"       : detail,
        "code"          : code,
        "status_code"   : status_code
    }, status=status_code)



def get_doctor_visit_times(doctor):
    from django.utils import timezone
    from datetime import datetime, timedelta
    from khayyam import JalaliDatetime

    def get_day_title(dt):
        now = timezone.now()
        if dt.day == now.day:
            return 'Today'
        elif (now + timedelta(days=1)).day == dt.day:
            return ' '.join(['Tomorrow', '-', JalaliDatetime(dt).strftime('%T'), ])
        return JalaliDatetime(dt).strftime('%T')

    def isvalid(dt):
        end = dt + timedelta(minutes=60)
        return doctor.visits.all().filter(datetime__gte=dt, datetime__lt=end).count() == 0

    days = []

    for i in range(10):
        now = datetime.now().replace(second=0, microsecond=0)

        if i > 0:
            now = (now + timedelta(days=i)
                   ).replace(hour=0, minute=0)

        weekday = JalaliDatetime(now).weekday()
        timerange = getattr(doctor, 'day'+str(weekday))

        if not timerange:
            continue

        start, end = timerange.split('-')
        start_time = JalaliDatetime.strptime(start, '%H:%M')
        end_time = JalaliDatetime.strptime(end, '%H:%M')

        day_start = now.replace(hour=start_time.hour, minute=start_time.minute)
        day_end = now.replace(hour=end_time.hour, minute=end_time.minute)

        if now < day_start:
            start = day_start
        elif now + timedelta(hours=1) > day_end:
            continue
        else:
            start = (now + timedelta(hours=1)).replace(minute=0)

        tmp = start
        res = []
        while tmp < day_end:
            res.append({
                'title': JalaliDatetime(tmp).strftime('%H:%M'),
                'datetime': tmp.strftime("%Y-%m-%dT%H:%M:%S"),
                'valid': isvalid(tmp)
            })
            tmp += timedelta(minutes=60)

        days.append({
            'title': get_day_title(tmp),
            'items': res
        })

        print(timerange)

    return days
