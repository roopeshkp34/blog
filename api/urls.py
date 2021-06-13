from django.urls import path
from . import views

urlpatterns = [
    path('',views.apiOverview,name="api-overview"),
    path('tasks',views.taskList,name="tasklist"),
    path('details/<str:id>',views.taskDetail,name="details"),
    path('create',views.taskCreate,name="taskCreate"),
    path('update/<str:id>/',views.taskUpdate,name="taskUpdate"),
    path('delete/<str:id>/',views.taskDelete,name="taskDelete"),
]
