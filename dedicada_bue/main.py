import requests
import pickle
import json
import ast
import numpy as np
import os
import time

companyid = '1a2b3c'

def get_data(companyid):
    try:
        print('emepando')
        request = requests.get(
            f'http://localhost:5000/user/get_data/{companyid}')
        response = request.text
        names = json.loads(response)['names']
        names = np.array(names)
        aca = 'D:\GitHub\\proyecto-21-junio\\dedicada_bue\pickle'
        if not os.path.exists(f'{aca}/{companyid}'):
            os.makedirs(f'{aca}/{companyid}')
        f = open(f'{aca}/{companyid}/known_names', 'wb')

        serialized = pickle.dump(names, f, pickle.HIGHEST_PROTOCOL)

        faces = json.loads(response)['faces']
        faces = np.array(faces)

        if not os.path.exists(f'{aca}/{companyid}'):
            os.makedirs(f'{aca}/{companyid}')
        f = open(f'{aca}/{companyid}/known_faces', 'wb')

        serialized = pickle.dump(faces, f, pickle.HIGHEST_PROTOCOL)

        f.close()
        print('done')
    except Exception as err:
        print('error',err)



get_data(companyid)