import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

const PASSWORD_MAX_LENGTH = 1024;

/**
 * Forme attendue du corps de POST /gerant/session : un e-mail et un mot de passe non vide.
 */
export class LogInGerantRequest {
	@IsEmail()
	public readonly email: string = "";

	@IsString()
	@IsNotEmpty()
	@MaxLength(PASSWORD_MAX_LENGTH)
	public readonly password: string = "";
}
