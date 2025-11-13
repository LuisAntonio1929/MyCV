import numpy as np
import matplotlib.pyplot as plt

def a(x):
    return 1
def mu(x):
    return 1
def h(x):
    return 1
def g(x):
    return 1
def phi(x,c,e):
    a=c-e
    b=c+e
    if a<=x and x<=c:
        return (x-a)/e
    elif c<=x and x<=b:
        return (b-x)/e
    else:
        return 0
def dphi(x,c,e):
    a=c-e
    b=c+e
    if a<=x and x<=c:
        return 1/e
    elif c<=x and x<=b:
        return -1/e
    else:
        return 0
L=1
N=10
X=np.linspace(0,L,N+1)