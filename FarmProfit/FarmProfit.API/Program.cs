using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace FarmProfit.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();


			builder.Services.AddAuthentication(options =>
				{
					options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(options =>
				{
					options.Authority = "https://dev-iqadq0gbmsvx3bju.us.auth0.com/";
					options.Audience = "https://farm-profit-webapp.azurewebsites.net";

					// Optional: validate additional parameters
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true
					};
				});

			// Add Authorization if needed
			builder.Services.AddAuthorization();

			var app = builder.Build();

			// Configure the HTTP request pipeline.

			app.UseAuthentication(); // must come BEFORE UseAuthorization
			app.UseAuthorization();


			app.MapControllers();

            app.Run();
        }
    }
}
