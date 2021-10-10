import datetime
from django.core.cache import cache
from django.conf import settings
rom django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import logout
from django.contrib import messages
import datetime
class ActiveUserMiddleware(MiddlewareMixin):

    def process_request(self, request):
        current_user = request.user
        if request.user.is_authenticated():
            now = datetime.datetime.now()
            cache.set('seen_%s' % (current_user.username), now, 
                           settings.USER_LASTSEEN_TIMEOUT)
class SessionIdleTimeout:
    def process_request(self, request):
        if request.user.is_authenticated():
            current_datetime = datetime.datetime.now()
            if ('last_login' in request.session):
                last = (current_datetime - request.session['last_login']).seconds
                if last > settings.SESSION_IDLE_TIMEOUT:
                    logout(request, login.html)
            else:
                request.session['last_login'] = current_datetime
        return None