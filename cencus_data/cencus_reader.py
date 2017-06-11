from pprint import pprint 
import json


class Population():
    
    def __init__(self):
        self.files_list = ['totalpopulation.txt', 'femalepopulation.txt', 'malepopulation.txt']
        self.pop_per_municipality_dict = {}

    def read_population(self,filename):
        with open('resources/'+filename,'r') as f:
            for line in f:
                listedline = line.strip().split(' ')
                popDict = {}
                popDict["Under1"]=int (listedline[1])
                popDict["1-4"]=int (listedline[2])
                popDict["5-9"]=int (listedline[3])
                popDict["10-14"]=int (listedline[4])
                popDict["15-19"]=int (listedline[5])
                popDict["20-24"]=int (listedline[6])
                popDict["25-29"]=int (listedline[7])
                popDict["30-34"]=int (listedline[8])
                popDict["35-39"]=int (listedline[9])
                popDict["40-44"]=int (listedline[10])
                popDict["45-49"]=int (listedline[11])
                popDict["50-54"]=int (listedline[12])
                popDict["55-60"]=int (listedline[13])
                popDict["60-64"]=int (listedline[14])
                popDict["65-69"]=int (listedline[15])
                popDict["70-74"]=int (listedline[16])
                popDict["75+"]=int (listedline[17])
                popDict["Total"] = int (listedline[18])
                self.pop_per_municipality_dict[listedline[0]]= popDict

    def generate_result_file(self, resultfilename):
        jsonpop = json.dumps(self.pop_per_municipality_dict)
        with open('result_files/'+resultfilename,'w') as f:
            f.write(jsonpop)


if __name__ == "__main__":
    pop = Population()
    for file_name in pop.files_list:
        broken = file_name.split('.')
        result_filename = 'result_'+broken[0]+'.json'
        pop.read_population(file_name)
        pop.generate_result_file(result_filename)
