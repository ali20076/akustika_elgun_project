const schoolData = {
	pupils: [
		{
			id: "pupil-001",
			name: "Emma Johnson",
			grade: 5,
			parentIds: ["parent-001"],
			payments: [
				{ id: "payment-001", amount: 150, currency: "USD", date: "2025-01-05", status: "paid" }
			],
			lessons: ["lesson-001", "lesson-002"],
			schedule: [
				{ day: "Monday", time: "09:00", lessonId: "lesson-001" },
				{ day: "Wednesday", time: "10:00", lessonId: "lesson-002" }
			],
			attendance: [
				{ date: "2025-01-06", status: "present" },
				{ date: "2025-01-08", status: "present" }
			],
			warnings: []
		}
	],
	teachers: [
		{
			id: "teacher-001",
			name: "Michael Smith",
			subject: "Mathematics",
			pupilIds: ["pupil-001"],
			lessons: ["lesson-001"],
			schedule: [
				{ day: "Monday", time: "09:00", lessonId: "lesson-001" }
			],
			attendance: [
				{ date: "2025-01-06", status: "present" }
			],
			payments: [
				{ id: "payment-002", amount: 1200, currency: "USD", date: "2025-01-01", status: "paid" }
			],
			warnings: []
		}
	],
	parents: [
		{
			id: "parent-001",
			name: "Sarah Johnson",
			email: "sarah.johnson@example.com",
			childIds: ["pupil-001"],
			payments: [
				{ id: "payment-001", amount: 150, currency: "USD", date: "2025-01-05", status: "paid" }
			],
			children: [
				{
					pupilId: "pupil-001",
					lessons: ["lesson-001", "lesson-002"],
					schedule: [
						{ day: "Monday", time: "09:00", lessonId: "lesson-001" },
						{ day: "Wednesday", time: "10:00", lessonId: "lesson-002" }
					],
					attendance: [
						{ date: "2025-01-06", status: "present" },
						{ date: "2025-01-08", status: "present" }
					]
				}
			],
			latestPayment: {
				amount: 150,
				currency: "USD",
				date: "2025-01-05",
				status: "paid"
			},
			warnings: []
		}
	],
	lessons: [
		{ id: "lesson-001", title: "Mathematics", teacherId: "teacher-001", pupilIds: ["pupil-001"] },
		{ id: "lesson-002", title: "English", teacherId: "teacher-001", pupilIds: ["pupil-001"] }
	],
	payments: [
		{ id: "payment-001", payerId: "parent-001", pupilId: "pupil-001", amount: 150, currency: "USD", date: "2025-01-05", status: "paid" },
		{ id: "payment-002", payerId: "teacher-001", amount: 1200, currency: "USD", date: "2025-01-01", status: "paid" }
	],
	warnings: []
};

module.exports = schoolData;


// Pupils
// if (age>18) { --- Muqavile ozu baglayir} else (valideyn)
// qeydiyyat tarixi (ayliq ders cedveli count , davamiyyet cedveli absent or unabsent , if(count < siyasi_secdiyin_gunler) warning fine)
// ders cedveli (gunler, saatlar)
// Teacher
// Islediyi merkezle qarsiliqli muqavile
// Heftelik ders cedveli ve saati
// Umumi sagird sayi
// Heftelik bos saatlari
// Maasi hesablamasi
// Ayliq hesabat
// Rehberliyi dersin ayliq hesabatina verilmesi
// Ay erzinde gelmeyen gunler
// Parents
// Merkezle muqavile 
// Telebin qeydiyyati (fin, dogum tarixi, qeyd tarixi, elaqe nomresi, orta mekteb, sinifi, ders sahe, )
// Valideyin ozu haqqinda (dogum tarixi, unvan, qeydiyyati, fin, sahesi ve pesasi)

// if while for foreach, filter, map, api key, object - diplom SQL 