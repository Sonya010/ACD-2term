#include <stdio.h>
#include <math.h>

typedef struct{
    double sum;
    double Fi;
} str;

str recursiveReturn(double x, int i){
    str res = {
        .sum=0,
        .Fi=0
    };
    str temp;
    if(i==0){
        res.Fi = x;
        res.sum= res.Fi;
    }else{
        temp = recursiveReturn(x,i-1);
        res.Fi = temp.Fi * x*x*(2*i-1)*(2*i-1)/(2*i*(2*i+1));
        res.sum = temp.sum + res.Fi;
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

    double result = M_PI_2 - recursiveReturn(x, n).sum;
    printf("Result_2 = %1.8f\n", result);
}