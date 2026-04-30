from flask import Flask, request, jsonify
from geopy.distance import geodesic

app = Flask(__name__)



@app.route('/hitung-biaya', methods=['POST'])
def hitung_biaya():
    data = request.json

    try:
        
        lat1 = float(data.get('latAwal'))
        lon1 = float(data.get('longAwal'))
        lat2 = float(data.get('latTujuan'))
        lon2 = float(data.get('longTujuan'))
        
        
        konsumsi = float(data.get('konsumsi', 40)) 
        
       
        harga_per_liter = float(data.get('harga_bbm', 0))

        
        start_coords = (lat1, lon1)
        end_coords = (lat2, lon2)
        jarak_km = round(geodesic(start_coords, end_coords).kilometers, 2)

        if konsumsi <= 0:
            return jsonify({"error": "Konsumsi BBM harus lebih dari 0"}), 400

        
        liter_dibutuhkan = round(jarak_km / konsumsi, 2)
        total_biaya = int(liter_dibutuhkan * harga_per_liter)

        return jsonify({
            "status": "success",
            "hasil": {
                "jarak_km": jarak_km,
                "bbm_liter": liter_dibutuhkan,
                "total_biaya": total_biaya
            }
        })

    except (TypeError, ValueError):
        return jsonify({"error": "Format data koordinat atau harga tidak valid"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)