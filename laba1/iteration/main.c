#include <stdio.h>
#include <math.h>

double result(double x, unsigned n) {
    double res = x;
    double prev = res;
    for (unsigned i = 1; i <= n; i++) {
        prev *= ((2 * i - 1) * (2 * i - 1) * x * x) / (2 * i *(2 * i + 1));
        res += prev;
    }
    return M_PI/2 - res;
}

int main() {
    int n = 0;
    double x = 0;

    printf("Enter n : ");
    scanf("%d", &n);
    printf("Enter x : ");
    scanf("%lf", &x);

    double RESULT = result (x, n);
    printf("Result = %1.8lf\n", RESULT);
    return 0;
}