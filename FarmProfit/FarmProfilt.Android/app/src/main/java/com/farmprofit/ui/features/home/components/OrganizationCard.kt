package com.farmprofit.ui.features.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.farmprofit.R
import com.farmprofit.repository.remote.models.Organization
import com.farmprofit.ui.theme.FarmProfitTheme

@Composable
fun OrganizationCard(
    organization: Organization,
    onQrCodeClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        )
    ) {
        Box(
            modifier = Modifier
                .wrapContentSize()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Column(
                modifier = Modifier,
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = organization.name,
                        style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium)
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Farm",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = organization.farmLevel,
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Icon(
                            imageVector = Icons.Outlined.Info,
                            contentDescription = null,
                            modifier = Modifier
                                .size(18.dp)
                                .padding(start = 4.dp)
                        )
                    }
                }
                Text(
                    text = stringResource(
                        R.string.registration_date,
                        organization.registrationDate
                    ),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = buildRichText(
                        label = stringResource(R.string.idno),
                        value = organization.idno
                    ),
                    style = MaterialTheme.typography.bodySmall,
                )
                Text(
                    text = buildRichText(
                        label = stringResource(R.string.active_assets),
                        value = organization.activeAssets.toString()
                    ),
                    style = MaterialTheme.typography.bodySmall,
                )
                Text(
                    text = buildRichText(
                        label = stringResource(R.string.current_balance),
                        value = organization.currentBalance
                    ),
                    style = MaterialTheme.typography.bodySmall,
                )

                if (organization.isVerifiedByAipa) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF4096F3),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Verified by AIPA",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF4096F3)
                        )
                    }
                }
            }

            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .background(color = MaterialTheme.colorScheme.primary, shape = CircleShape)
                    .size(48.dp)
                    .clickable {
                        onQrCodeClick()
                    },
            ) {
                Icon(
                    modifier = Modifier.padding(8.dp),
                    painter = painterResource(R.drawable.ic_qr_code),
                    contentDescription = "",
                    tint = Color.White
                )
            }
        }
    }
}

@Composable
private fun buildRichText(label: String, value: String): AnnotatedString {
    return buildAnnotatedString {
        append(label)
        append(" ")
        withStyle(style = SpanStyle(fontWeight = FontWeight.W600)) {
            append(value)
        }
    }
}

@Preview
@Composable
fun OrganizationCardPreview() {
    FarmProfitTheme {
        Column {
            val organization = Organization(
                name = "Green Acres Farm",
                registrationDate = "15/05/2020",
                idno = "GA123456",
                activeAssets = 150,
                currentBalance = "$12,500",
                isVerifiedByAipa = true,
                farmLevel = "Gold",
            )
            OrganizationCard(organization, onQrCodeClick = {})
            Spacer(modifier = Modifier.width(8.dp))
        }
    }
}