using Auth0.AspNetCore.Authentication;
using FarmProfit.API.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace FarmProfit.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
	        Log.Logger = new LoggerConfiguration()
		        .Enrich.FromLogContext()
		        .WriteTo.Console()
		        .CreateBootstrapLogger();

			var builder = WebApplication.CreateBuilder(args);

			builder.Services.AddSerilog((services, lc) => lc
				.ReadFrom.Configuration(builder.Configuration)
				.ReadFrom.Services(services)
				.Enrich.FromLogContext());
			builder.Services.AddControllers();

            builder.Services.AddDbContext<AppDbContext>(options =>
	            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

			var domain = builder.Configuration["Auth0:Domain"]!;
			var audience = builder.Configuration["Auth0:Audience"]!;

			builder.Services.AddAuthentication(options =>
				{
					options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(options =>
				{
					options.Authority = $"https://{domain}/";
					options.Audience = audience;
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = false,
						ValidateAudience = false,
						ValidateIssuerSigningKey = true,
						ValidateLifetime = true,
						ValidIssuer = $"https://{domain}/",
						ValidAudience = audience
					};
				});

			// Add Authorization if needed
			builder.Services.AddAuthorization();
			builder.Services.AddHttpClient();

			var app = builder.Build();

			// Configure the HTTP request pipeline.

			app.UseAuthentication(); // must come BEFORE UseAuthorization
			app.UseAuthorization();


			app.MapControllers();

            app.Run();
        }
    }
}
