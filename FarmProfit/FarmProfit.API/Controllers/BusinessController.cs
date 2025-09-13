using FarmProfit.API.Contexts;
using FarmProfit.API.Extensions;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/business")]
public class BusinessController(AppDbContext db, ILogger<BusinessController> logger) : ControllerBase
{
	[HttpGet]
	[Authorize]
	public async Task<IActionResult> GetBusinessListForUser()
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var businessList = db.Businesses.Include(b => b.Contact).Where(u=>u.UserId == employee.Id);
			return await Task.FromResult<IActionResult>(Ok(businessList));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business retrieval: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<IActionResult> CreateBusiness(Businesses business)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity = await db.Businesses.AddAsync(business);
			await db.SaveChangesAsync();
			return Ok(entity.Entity);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business save: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPut]
	[Authorize]
	public async Task<IActionResult> UpdateBusiness(Businesses business)
	{
		try
		{
			var employee = HttpContext.GetEmployee();
			if (employee is null) return BadRequest();

			var entity= db.Businesses.Include(b => b.Contact).FirstOrDefault(u => u.Id == business.Id);
			if (entity is null) return BadRequest("Unknown business");

			entity.BusinessName = business.BusinessName;
			entity.IDNO = business.IDNO;
			entity.LegalForm = business.LegalForm;
			entity.RegistrationDate = business.RegistrationDate;
			entity.BusinessName = business.BusinessName;
			entity.Contact.Address = business.Contact.Address;
			entity.Contact.Email = business.Contact.Email;
			entity.Contact.Phone = business.Contact.Phone;
			entity.Contact.PostalCode = business.Contact.PostalCode;
			entity.Contact.Region = business.Contact.Region;

			var updatedEntity = db.Businesses.Update(entity);

			await db.SaveChangesAsync();
			return Ok(updatedEntity);
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during business update: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}
}
