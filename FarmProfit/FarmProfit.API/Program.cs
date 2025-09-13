using FarmProfit.API.Contexts;
using FarmProfit.API.Middleware;
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

			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowLocalhost", policy =>
				{
					policy.WithOrigins("http://localhost:5173") // React dev server
						.AllowAnyHeader()
						.AllowAnyMethod(); // GET, POST, OPTIONS, etc.
				});
			});

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
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateIssuerSigningKey = true,
						ValidateLifetime = true,
						ValidAudience = audience
					};
				});

			builder.Services.AddAuthorization();
			builder.Services.AddHttpClient();

			var app = builder.Build();

			app.UseAuthentication();
			app.UseAuthorization();
			app.UseMiddleware<UserProvisioningMiddleware>();

			app.UseCors("AllowLocalhost");
			app.MapControllers();

            app.Run();
        }
    }
}
