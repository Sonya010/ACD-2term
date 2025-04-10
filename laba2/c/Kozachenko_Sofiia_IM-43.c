#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char key[6];
    struct Node* prev;
    struct Node* next;
} Node;

void clearMemory(Node* head);

Node* createList (int n) {
    if (n <= 0) return NULL;
    Node* head = NULL;
    Node* tail = NULL;
    for (int i = 0; i < n; i++) {
        Node* newNode = (Node*)malloc(sizeof(Node));
        if (newNode == NULL) {
            printf("Not enough memory for new node\n");
            clearMemory(head);
            return NULL;
        };

        char input[20];
        while (1) {
            printf("Enter element %d (max 5 characters): ", i);
            fgets(input, sizeof(input), stdin);
            input[strcspn(input, "\n")] = '\0';

            if (strlen(input) <= 5) {
                strcpy(newNode->key, input);
                break;
            } else {
                printf("Error! Too many characters. Please enter up to 5 characters.\n");
            }
        }

        newNode->next = NULL;
        newNode->prev = tail;

        if (tail != NULL) {
            tail->next = newNode;
        } else {
            head = newNode;
        }
        tail = newNode;
    }
    return head;
}

Node* reverseList(Node* head) {
    if (head == NULL) return NULL;
    Node* temp = NULL;
    Node* current = head;

    while (current != NULL) {
        temp = current->prev;
        current->prev = current->next;
        current->next = temp;
        if (current->prev == NULL)
            return current;
        current = current->prev;
    }
    return head;
}

void printList (Node* head) {
    while (head != NULL) {
        printf("%s\t", head->key);
        head = head->next;
    }
}

void clearMemory (Node* head) {
    while (head != NULL) {
        Node* temp = head;
        head = head->next;
        free(temp);
    }
}

int main() {
    int n;
    printf("Enter the number of elements: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input!\n");
        return 1;
    }
    while (getchar() != '\n');

    Node* head = createList(n);

    printf("\nInitial list:\n");
    printList(head);

    head = reverseList(head);

    printf("\nReversed list:\n");
    printList(head);

    clearMemory(head);

    return 0;
}