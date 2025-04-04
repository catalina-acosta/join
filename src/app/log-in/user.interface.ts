/**
 * UserInterface defines the structure of a user object.
 * It is used to represent a user within the system with basic details such as name and email.
 */
export interface UserInterface {
    /**
     * The unique identifier of the user. This field is optional as it may not be present in some contexts (e.g., new user creation).
     */
    id?: string;

    /**
     * The full name of the user.
     */
    fullname: string;

    /**
     * The email address of the user.
     */
    email: string;
}
