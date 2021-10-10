from django.db.models import fields
from django.forms import forms, widgets
from django.forms.models import ModelForm
from account.models import Customer
from django.contrib.auth.models import User
from django import forms
from datetimewidget.widgets import DateTimeWidget
from django.contrib.auth.forms import UserCreationForm

class CreateUserForm(UserCreationForm):
    class Meta:
        model=User
        fields=('first_name','email','password1','password2')
class CustomerForm(forms.ModelForm):
    class Meta:
        model= Customer
        fields=['address','name','user_type','gender','date_of_birth','image','phone_number']
        
class LoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(
        attrs={
        "class": "form-control"
    }))
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "id": "user-password"
            }
        )
    )            
CANCEL_CHOICES=(
    ('','vui lòng chọn lý do'),
    ('đổi ý','đổi ý'),
    ('hàng xấu','hàng xấu'),
    ('giao chậm','giao chậm'),
    ('hết tiền','hết tiền'),
    ('chọn sai màu','chọn sai màu')
)
USER_TYPE=(
        ('C','Customer'),
        ('S','Seller')
    )
GENDER_CHOICE=(
        ('M','MALE'),
        ('F','FEMALE'),
        ('O','ORTHER')
    )
class CancelForm(forms.Form):
    reson=forms.ChoiceField(choices=CANCEL_CHOICES,label='')
    message = forms.CharField(label=' ', required=False, widget=forms.Textarea(attrs={
        'rows': 4,'cols':60,'class':'mt-5','style':'width:420px','placeholder':"more infomation"
    }))
GENDER_CHOICE=(
        ('M','MALE'),
        ('F','FEMALE'),
        ('O','ORTHER')
    )
class UpdateImageForm(forms.ModelForm):
    gender=forms.CharField(label='Gender', widget=forms.RadioSelect(choices=GENDER_CHOICE))
    class Meta:
        model=Customer
        fields=['name','phone_number','gender','date_of_birth','image']
       
        

        
     
        