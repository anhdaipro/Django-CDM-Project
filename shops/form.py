from django import forms
from .models import Comment,Review

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['comment']

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['review_text', 'review_rating']