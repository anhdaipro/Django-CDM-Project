import django
from django.shortcuts import redirect, render
from django.views import generic
from .models import *
from django.utils import timezone
#from order.models import Order,OrderItem,Address

#from refund.models import CancelOrder
from django.http.response import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from .form import CreateUserForm,CustomerForm,LoginForm,CancelForm,UpdateImageForm
from django.urls import reverse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import  View
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.forms import UserChangeForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
import paypalrestsdk
from paypalrestsdk import Sale
import datetime
#from django.contrib.sites.shortcuts import get_current_site
#from django.template.loader import render_to_string
#from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
#from django.contrib.auth.tokens import default_token_generator
#from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
import random
#from django.core.mail import EmailMessage
from django.core.mail import send_mail
UserModel = get_user_model()
paypalrestsdk.configure({
  'mode': 'sandbox', #sandbox or live
  'client_id': 'AY2deOMPkfo32qrQ_fKeXYeJkJlAGPh5N-9pdDFXISyUydAwgRKRPRGhiQF6aBnG68V6czG5JsulM2mX',
  'client_secret': 'EJBIHj3VRi77Xq3DXsQCxyo0qPN7UFB2RHQZ3DOXLmvgNf1fXWC5YkKTmUrIjH-jaKMSYBrH4-9RjiHA' })
# Create your views here.

from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver    

class SingnupView(generic.View):
    def get(self,request):
        context = {
        'form':CreateUserForm(),
        'time':60
        }
        return render(request,'account/signup.html',context)
    def post(self,request):
        get_otp = request.POST.get('otp') #213243 #None
        form=CreateUserForm(request.POST) 
        if get_otp:
            first_name = request.POST.get('first_name')
            user=User.objects.get(username=first_name)
            current_time=timezone.now()
            time_st=UserOTP.objects.filter(user = user).last().time_st
            time_experi=current_time-time_st
            time=time_experi.seconds
            if int(get_otp) == UserOTP.objects.filter(user = user).last().otp and time<=60:
                user.is_active = True
                user.save()
                messages.success(request, f'Account is Created For {user.username}')
                return redirect('app_user:signin')
            elif int(get_otp) == UserOTP.objects.filter(user = user).last().otp and time>6000:
                user.delete()
                messages.warning(request, f'Otp code has expired, your account had been deleted')
                return redirect('app_user:signup')
            
            else:
                messages.warning(request, f'You Entered a Wrong OTP')
                return redirect('app_user:signup')
        
	      
        if form.is_valid():
            user=form.save(commit=False)
            email_check=User.objects.filter(email=user.email)
            if email_check.exists():
                messages.error(request,'This email already exists')
                return redirect('app_user:signup')
            else:
                name=user.first_name
                user.username=name.replace(' ','')
                user.first_name=name.split(' ')[0]
                user.last_name=name.split(' ')[-1]
                user.is_active = False # Deactivate account till it is confirmed
                user.save()
                usr_otp = random.randint(100000, 999999)
                UserOTP.objects.create(user = user, otp = usr_otp)
                mess = f"Hello {user.first_name},\nYour OTP is {usr_otp}\nThanks!"
                send_mail(
				"Welcome to AnhDai's Shop - Verify Your Email",
				mess,
				settings.EMAIL_HOST_USER,
				[user.email],
				fail_silently = False
				)  
                return render(request, 'account/signup.html', {'otp': True, 'user': user})
        else:
            messages.success(request,'Please fill in the correct information')
            return redirect('app_user:signup')

def login_view(request):
    form = LoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect("home:home")
        
        elif User.objects.filter(username = username).exists() and not User.objects.get(username=username).is_active:
            messages.info(request,'You have not verified your account')
            return redirect("app_user:signin")
        else:
            messages.error(request,'password or username incorect')
            return redirect("app_user:signin")
    return render(request, "account/signin.html", {"form": form})

@receiver(user_logged_in)
def got_online(sender, user, request, **kwargs):    
    user.customer.is_online = True
    user.customer.save()

@receiver(user_logged_out)
def got_offline(sender, user, request, **kwargs):   
    user.customer.is_online = False
    user.customer.save()

def resend_otp(request):
    if request.method == "GET":
	    get_usr = request.GET.get('first_name')
	    if User.objects.filter(username = get_usr).exists() and not User.objects.get(username = get_usr).is_active:
		    user = User.objects.get(username=get_usr)
		    usr_otp = random.randint(100000, 999999)
		    UserOTP.objects.create(user = user, otp = usr_otp)
		    mess = f"Hello {user.first_name},\nYour OTP is {usr_otp}\nThanks!\nAnhDai"

		    send_mail(
				"Welcome to AnhDai's Shop - Verify Your Email",
				mess,
				settings.EMAIL_HOST_USER,
				[user.email],
				fail_silently = False
				)
		    return HttpResponse("Resend")

    return HttpResponse("Can't Send ")

def logout_view(request):
    logout(request)
    return redirect('app_user:signin')

'''class OrderSuccess(LoginRequiredMixin, View):
    def get(self, requset, *args, **kwargs):
        form=CancelForm()
        order = Order.objects.filter(user=requset.user, ordered=True).order_by('-ordered_date')
        context = {
            'order': order,
            'form'   :form
        }
        return render(requset, 'account/order_success.html', context)

class RequestCanCelView(View):
    def post(self, *args, **kwargs):
            form = CancelForm(self.request.POST)
            if form.is_valid():
                message = form.cleaned_data.get('message')
                reson  = form.cleaned_data.get('reson')
                id=self.request.POST.get('id')
                # edit the order
                try:
                    order = Order.objects.get(user=self.request.user,canceled=False,id=id,received=False,ordered=True)
                    order.canceled=True
                    order.save()
                    if order.payment.payment_method=="P":
                        sale = Sale.find(order.payment.stripe_charge_id)
                        refund = sale.refund({
                        "amount": {
                        "total":order.total_final(),
                        "currency": "USD"
                        }
                        })
                    # store the cancel
                    cancel = CancelOrder()
                    cancel.order = order
                    cancel.reason = reson
                    cancel.more_information=message
                    cancel.user=self.request.user
                    cancel.save()
                    order_items = order.items.all()
                    order_items.update(ordered=True)
                    for item in order_items:
                        item.save() 
                        products=Variant.objects.get(orderitem=item.id)
                        products.stock += item.quantity
                        products.save()
                    messages.info(self.request, "Cancel success.")
                    return redirect('app_user:order_success')
                except ObjectDoesNotExist:
                    messages.info(self.request, "This order does not exist.")
                    return redirect("app_user:order_success")'''
                
class CustomerView(View):
    def get(self,request):
        customer_form=UpdateImageForm(instance=request.user.customer)   
        return render(request,'account/customer.html',{'customer_form':customer_form})
    def post(self,request):
        if request.method=="POST":
            customer_form=UpdateImageForm(request.POST,
                                    request.FILES,
                                    instance=request.user.customer)
            if  customer_form.is_valid():
                customer_form.save()
                messages.success(request, f'Your account has been updated!')
                return redirect('app_user:customer')    
        
'''@login_required
def address(request):
    addresses = Address.objects.filter(user=request.user)
    context={
        'addresses':addresses
    }
    return render(request,'account/address.html',context)

def delete_address(request):
    url = request.META.get('HTTP_REFERER')
    if request.method=="POST":
        id=request.POST.get('id')
        address=Address.objects.get(id=id)
        address.delete()
        return HttpResponseRedirect(reverse('app_user:address'))

@login_required
def update_address(request,id):
    url = request.META.get('HTTP_REFERER')
    if request.method=="POST":
        try:
            address=Address.objects.get(id=id,user=request.user)
            form=AddressForm(request.POST,instance=address)
            form.save()  
            return redirect(url)
        except Exception:
            return redirect(url)
@login_required
def add_address(request):
    if request.method=="POST":
        form=AddressForm(request.POST )
        if form.is_valid():
            data=Address()
            data.user=request.user
            data.name=form.cleaned_data.get('name')
            data.phone_number=form.cleaned_data.get('phone_number')
            data.address=form.cleaned_data.get('address')
            data.city=form.cleaned_data.get('city')
            data.address_type="S"
            data.save()
            return redirect('app_user:address')
        else:
            messages.info(request,'k hop le')
            return redirect('app_user:address')'''
        
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(data=request.POST, user=request.user)

        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect(reverse('app_user:customer'))
        else:
            return redirect(reverse('app_user:change_password'))
    else:
        form = PasswordChangeForm(user=request.user)

        args = {'form': form}
        return render(request, 'account/change_password.html', args)
            
        
    