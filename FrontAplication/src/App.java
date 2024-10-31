import Structures.User;
import Structures.UserQueue;

public class App {
    public static void main(String[] args) throws Exception {

        UserQueue queue = new UserQueue(12);

        queue.enqueue(new User("12345678900", "Alice", 27, "Alice@gmail.com", null));
        queue.enqueue(new User("98765432100", "Bob", 22, "Bob@gmail.com", null));
        queue.enqueue(new User("12345678900", "Alice", 27, "Alice@gmail.com", null));
        queue.enqueue(new User("98765432100", "Bob", 22, "Bob@gmail.com", null));
        queue.enqueue(new User("55512345678", "Charlie", 30, "Charlie@gmail.com", null));
        queue.enqueue(new User("44456789012", "David", 25, "David@gmail.com", null));
        queue.enqueue(new User("33309876543", "Eve", 29, "Eve@gmail.com", null));
        queue.enqueue(new User("22223456789", "Frank", 33, "Frank@gmail.com", null));
        queue.enqueue(new User("11145678901", "Grace", 24, "Grace@gmail.com", null));
        queue.enqueue(new User("99956789012", "Hannah", 28, "Hannah@gmail.com", null));
        queue.enqueue(new User("88867890123", "Ivy", 31, "Ivy@gmail.com", null));
        queue.enqueue(new User("77778901234", "Jack", 26, "Jack@gmail.com", null));

        System.out.println("The queue is "+queue.getOccupationRate()+"% occupied");
        System.out.println("Voçê esta na " + queue.getUserPositionByCpf("22223456789") + "° posição");
        queue.removeUserByCpf("22223456789");
        System.out.println("The queue is "+queue.getOccupationRate()+"% occupied"); 
        queue.enqueue(new User("22223456789", "Frank", 33, "Frank@gmail.com", null));
        System.out.println("Voçê esta na " + queue.getUserPositionByCpf("22223456789") + "° posição");
        System.out.println("The queue is "+queue.getOccupationRate()+"% occupied");
        





        


    }
}
