#include <stdio.h>
#include <math.h>

double recursiveDecent(double x, int n, int i, double Fi, double sum){
    double res = 0;
    if(n==0){
        res = sum;
    }else{
        Fi = Fi*x*x*(2*i-1)*(2*i-1)/(2*i*(2*i+1));
        res = recursiveDecent(x, n-1, i+1, Fi, sum + Fi);
    }
    return res;
}

int main(){
    int n = 0;
    double x = 0;
    printf("Enter n: ");
    scanf("%d", &n);
    printf("Enter x: ");
    scanf("%lf", &x);

    double F0 = x;
    double sum = F0;
    double result = M_PI_2 - recursiveDecent(x, n, 1, F0, sum);
    printf("Result_1 = %1.8f\n", result);
}