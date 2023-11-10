#include <iostream>

class Figure {
protected:
    double dim1, dim2;

public:
    Figure(double a, double b) : dim1(a), dim2(b) {}

    virtual double area() {
        return 0;
    }
};

class Triangle : public Figure {
public:
    Triangle(double a, double b) : Figure(a, b) {}

    double area() override {
        return dim1 * dim2 / 2;
    }
};

class Rectangle : public Figure {
public:
    Rectangle(double a, double b) : Figure(a, b) {}

    double area() override {
        return dim1 * dim2;
    }
};

int main() {
    Rectangle r(9, 5);
    Triangle t(10, 8);
    Figure* fig;

    fig = &r;
    std::cout << "Area: " << fig->area() << std::endl;

    fig = &t;
    std::cout << "Area: " << fig->area() << std::endl;

    return 0;
}

