package com.example.Bitcoin.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDate;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String emailId;

    private String firstName;
    private String lastName;
    private String gender;
    private String country;
    private LocalDate dob;
    private String role;
    private String password;

}
