const sql = require('mssql');

var webconfig = {
  user: 'batuhan61',
  password: 'batuhan28',
  server: '192.168.2.165',
  database: 'bitirmeProjesi'
};

// Üye İşlemleri
module.exports.userUyeOl = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_UyeKontrol ('" + req.body.uye_kullanici_Adi + "','" + req.body.uye_EMail + "') as varmi", function(err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          sql.close();
          res.render('oturumac', { hata: 'Kullanıcı adı bulunmaktadır ' });
        } else {
          request1.query(
            "INSERT INTO Uye(Adi,Soyadi,Sifre,Email,KullaniciAdi)  VALUES('" +
              req.body.uye_Adi +
              "','" +
              req.body.uye_Soyadi +
              "','" +
              req.body.uye_Sifre +
              "','" +
              req.body.uye_EMail +
              "','" +
              req.body.uye_kullanici_Adi +
              "')",
            function(err, data) {
              if (err) {
                console.log(err);
              }

              sql.close();
              res.render('oturumac', { hata: '' });
            }
          );
        }
      });
    });
  });
};

module.exports.UyeOl = function(req, res) {
  res.render('oturumac', { hata: '' });
};

// Kullanıcı Giriş Kontrol
module.exports.kullaniciGiris = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_UyeVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function(kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Uye where KullaniciAdi='" + req.body.ad + "'", function(err, data) {
            req.session.ad = req.body.ad;

            if (err) {
              console.log(err);
            }

            res.render('Anasayfa', { veri: data.recordset });
          });
        } else {
          sql.close();
          res.render('Login', { hata: 'Kullanıcı adı veya sifre hatalı' });
        }
      });
    });
  });
};

// Mekan Üyeliği
module.exports.userMekanUye = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_MekanKontrol ('" + req.body.mekan_Adi + "') as varmi", function(err, control) {
      if (err) {
        console.log(err);
      }

      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          sql.close();
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
        } else {
          request1.query(
            "INSERT INTO Mekan(MekanAdı,AdıSoyadı,Sifre,Lokasyon,MekanResim,AcilisSaati,KapanisSaati,PaketSiparis,Kategori)  VALUES('" +
              req.body.mekan_Adi +
              "','" +
              req.body.uye_Adi_Soyadi +
              "','" +
              req.body.mekan_Sifre +
              "','" +
              req.body.mekan_lokasyon +
              "',CAST( '" +
              req.file.buffer.toString('base64') +
              "'  AS VARBINARY(MAX)) ,'" +
              req.body.mekan_acilisSaati +
              "','" +
              req.body.mekan_kapanisSaati +
              "','" +
              req.body.paketSiparis +
              "','" +
              req.body.kategori +
              "')",

            function(err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      });
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
          sql.close();

          request1.query(function(err, data) {
            if (err) {
              console.log(err);
            }

            res.render('oturumac', { hata: '' }); // bunu silmen hatayı çözebilir.
            sql.close();
          });
        }
      });
      // İçecek İnsert
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
          sql.close();
        } else {
          if (req.body.İcecek_1) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_1 +
                "','" +
                req.body.İcecekFiyat_1 +
                "','" +
                req.body.İcecekKategori_1 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_2) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_2 +
                "','" +
                req.body.İcecekFiyat_2 +
                "','" +
                req.body.İcecekKategori_2 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_3) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_3 +
                "','" +
                req.body.İcecekFiyat_3 +
                "','" +
                req.body.İcecekKategori_3 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_4) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_4 +
                "','" +
                req.body.İcecekFiyat_4 +
                "','" +
                req.body.İcecekKategori_4 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_5) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_5 +
                "','" +
                req.body.İcecekFiyat_5 +
                "','" +
                req.body.İcecekKategori_5 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_6) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_6 +
                "','" +
                req.body.İcecekFiyat_6 +
                "','" +
                req.body.İcecekKategori_6 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_7) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_7 +
                "','" +
                req.body.İcecekFiyat_7 +
                "','" +
                req.body.İcecekKategori_7 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_8) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_8 +
                "','" +
                req.body.İcecekFiyat_8 +
                "','" +
                req.body.İcecekKategori_8 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_9) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_9 +
                "','" +
                req.body.İcecekFiyat_9 +
                "','" +
                req.body.İcecekKategori_9 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.İcecek_10) {
            request1.query(
              "INSERT INTO İcecekMenu(İcecek,İcecekFiyat,Kategori)  SELECT '" +
                req.body.İcecek_10 +
                "','" +
                req.body.İcecekFiyat_10 +
                "','" +
                req.body.İcecekKategori_10 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
        }
      });
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
          sql.close();

          request1.query(function(err, data) {
            if (err) {
              console.log(err);
            }

            res.render('oturumac', { hata: '' }); // bunu silmen hatayı çözebilir.
            sql.close();
          });
        }
      });
      // Yemek İnsert
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
          sql.close();
        } else {
          if (req.body.Yemek_1) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_1 +
                "','" +
                req.body.Fiyat_1 +
                "','" +
                req.body.Kategori_1 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
          if (req.body.Yemek_2) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_2 +
                "','" +
                req.body.Fiyat_2 +
                "','" +
                req.body.Kategori_2 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_3) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_3 +
                "','" +
                req.body.Fiyat_3 +
                "','" +
                req.body.Kategori_3 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_4) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_4 +
                "','" +
                req.body.Fiyat_4 +
                "','" +
                req.body.Kategori_4 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_5) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_5 +
                "','" +
                req.body.Fiyat_5 +
                "','" +
                req.body.Kategori_5 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_6) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_6 +
                "','" +
                req.body.Fiyat_6 +
                "','" +
                req.body.Kategori_6 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_7) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_7 +
                "','" +
                req.body.Fiyat_7 +
                "','" +
                req.body.Kategori_7 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_8) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_8 +
                "','" +
                req.body.Fiyat_8 +
                "','" +
                req.body.Kategori_8 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_9) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_9 +
                "','" +
                req.body.Fiyat_9 +
                "','" +
                req.body.Kategori_9 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
          if (req.body.Yemek_10) {
            request1.query(
              "INSERT INTO YemekMenu(Yemek,YemekFiyat,Kategori)  SELECT '" +
                req.body.Yemek_10 +
                "','" +
                req.body.Fiyat_10 +
                "','" +
                req.body.Kategori_10 +
                "'",
              function(err, data) {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.render('oturumac', { hata: '' });
          }
        }
      });
    });
  });
};

// Mekan Girişi
module.exports.mekanGiris = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_MekanVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function(kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Mekan where MekanAdı='" + req.body.ad + "'", function(err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }
            sql.close();
            res.render('mekanSahibiProfili', { veri: data.recordset });
          });
        } else {
          sql.close();
          res.render('mekanLogin', { hata: 'Kullanıcı adı veya sifre hatalı' });
        }
      });
    });
  });
};
module.exports.hamburger = function(req, res) {
  // Hamburger kategorisi
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select * from Mekan where Kategori = 'Hamburger' ", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('hamburger', { veri: verisonucu.recordset });
    });
  });
};

module.exports.Profile = function(req, res) {
  // Profilim
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();

    request1.query("select * from Uye where KullaniciAdi  ='" + req.session.ad + "'", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }

      console.log('', req.session.ad);
      sql.close();
      res.render('Profilim', { veri: verisonucu.recordset });
    });
  });
};

module.exports.MekanProfile = function(req, res) {
  // Profilim
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();

    request1.query("select * from Mekan where MekanAdı  ='" + req.session.ad + "'", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }

      console.log('', req.session.ad);
      sql.close();
      res.render('mekanSahibiProfili', { veri: verisonucu.recordset });
    });
  });
};
module.exports.MekanGuncelle = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      // MEKAN GÜNCELLE
      `
        UPDATE Mekan set 
        AdıSoyadı = '${req.body.isimsoyisim}',
        MekanAdı = '${req.body.mekanadi}',
        Lokasyon = '${req.body.yeniadres}',
        PaketSiparis = '${req.body.paketsiparisvarmi}',
        AcilisSaati = '${req.body.mekan_acilis}',
        KapanisSaati = '${req.body.mekan_kapanis}'
        WHERE id = '${req.body.guncellenecekEtkinlikId}'
        `,
      function(err, dataresult) {
        if (err) {
          console.log(err);
        } else {
          res.send('Güncellendi');
        }
        sql.close();
      }
    );
  });
};

module.exports.KullaniciLogin = function(req, res) {
  res.render('Login', { hata: '' });
};
module.exports.PatronLogin = function(req, res) {
  res.render('restaurantuyeol', { hata: '' });
};

module.exports.PatronGiris = function(req, res) {
  res.render('mekanlogin', { hata: '' });
};
