from flask import Flask, request, jsonify
from geopy.distance import geodesic

app = Flask(__name__, host_matching=True, static_host="localhost")

Harga_BBM = {
    "Pertalite": 10000,
    "Pertamax": 12300,
    "Pertamax Green": 12900,
    "Pertamax Turbo": 19400,
    "Solar": 6800,
    "Dexlite": 23600,
}

Konsumsi_Kendaraan = {
    "Motor": 40,
    "Mobil": 12,
    "Truk": 6,
}

@app.route('/hitung-biaya', methods=['POST'])
def hitung_biaya():
    data = request.json

    try:
        
        start_coords = (data['start_lat'], data['start_lon'])
        end_coords = (data['end_lat'], data['end_lon']) 
        kendaraan = data['jenis_kendaraan']
        jenis_bbm = data['jenis_bbm']

        jarak = geodesic(start_coords, end_coords).kilometers
        jarak = round(jarak, 2)

        if kendaraan not in Konsumsi_Kendaraan:
            return jsonify({"error": "Jenis kendaraan tidak valid"}), 400
        
        if jenis_bbm not in Harga_BBM:
            return jsonify({"error": "Jenis BBM tidak valid"}), 400 
        
        konsumsi = Konsumsi_Kendaraan[kendaraan]
        harga = Harga_BBM[jenis_bbm]
        biaya= (jarak / konsumsi) 
        biaya = round(biaya, 2)

        total_biaya = int(biaya * harga)
        total_biaya = round(total_biaya, 2)

        return jsonify({
            "status": "success",
            "hasil": {
                "jarak_km": jarak,
                "biaya_liter": biaya,
                "total_biaya": total_biaya
            }
        })

    except KeyError as e:
        return jsonify({"error": f"Missing : {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if app == Flask:
    app.run(debug=True) 