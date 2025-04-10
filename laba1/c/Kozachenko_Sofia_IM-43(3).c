#include <stdio.h>
#include <math.h>

double recursiveMix(double x, int n, int i, double Fi){
    double sum = 0;
    if(n==0){
        sum = x;
    }else{
        Fi = Fi*x*x*(2*i-1)*(2*i-1)/(2*i*(2*i+1));
        sum = Fi + recursiveMix(x, n-1, i+1, Fi);
    }
    return sum;
}

int main(){
    int n = 0;
    double x = 0;

    printf("Enter n: ");
    scanf("%d", &n);
    printf("Enter x: ");
    scanf("%lf", &x);

    double F0 = x;
    double result = M_PI_2 - recursiveMix(x, n, 1, F0);
    printf("Result_3 = %1.8f\n", result);
}