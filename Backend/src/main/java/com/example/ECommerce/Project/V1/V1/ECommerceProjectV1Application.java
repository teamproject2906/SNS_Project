package com.example.ECommerce.Project.V1.V1;

import com.example.ECommerce.Project.V1.Model.Address;
import com.example.ECommerce.Project.V1.Model.User;
import com.example.ECommerce.Project.V1.Repository.AddressRepository;
import com.example.ECommerce.Project.V1.Repository.UserRepository;
import com.example.ECommerce.Project.V1.RoleAndPermission.Role;
import com.github.javafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class ECommerceProjectV1Application {

	public static void main(String[] args) {
		SpringApplication.run(ECommerceProjectV1Application.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			UserRepository userRepository,
			AddressRepository addressRepository
	) {
		return args -> {
			for (int i = 0; i < 2; i++){
				Faker faker = new Faker();

				// Create user
				var user = User.builder()
						.firstname(faker.name().firstName())
						.lastname(faker.name().lastName())
						.username(faker.name().username())
						.email(faker.internet().emailAddress())
						.password("123")
						.dob(faker.date().birthday())
						.phoneNumber(faker.number().digits(11))
						.gender(true)
						.bio("Hello this is the " + i + " person")
						.avatar(null)
						.role(Role.USER)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.createdBy("SYSTEM")
						.updatedBy("SYSTEM")
						.isActive(true)
						.build();
				userRepository.save(user);

				// Create address
				var address = Address.builder()
						.user(user)
						.addressDescription(faker.address().fullAddress())
						.addressDetail(faker.address().streetAddress())
						.ward(faker.address().streetName())
						.district(faker.address().cityName())
						.province(faker.address().state())
						.country(faker.address().country())
						.isDefault(false)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.createdBy(String.valueOf(user.getFirstname() + user.getLastname()))
						.updatedBy(String.valueOf(user.getFirstname() + user.getLastname()))
						.isActive(true)
						.build();
				addressRepository.save(address);
			}
		};
	}
}
